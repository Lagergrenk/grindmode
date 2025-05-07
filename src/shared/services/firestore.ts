import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  limit,
  orderBy,
  query,
  Timestamp,
  updateDoc,
  where,
  WhereFilterOp,
  QueryConstraint,
  getDoc,
} from 'firebase/firestore';
import { getCurrentUserId } from '@/shared/utils/getCurrentUserId';
import { db } from '@/config/firebase';

export interface IFirestoreTimestamps {
  createdAt: Timestamp;
  updatedAt: Timestamp;
  date: Timestamp;
}

export interface IQueryFilter {
  field: string;
  operator: WhereFilterOp;
  value: string | number | boolean | Timestamp;
}

export class FirestoreService<T extends IFirestoreTimestamps> {
  private readonly collectionName: string;

  constructor(collectionName: string) {
    this.collectionName = collectionName;
  }

  /**
   * Add a new document to the collection
   * @param data - Data to add
   * @param useServerTimestamp - Whether to use server timestamp for date fields
   * @returns - Document ID of the added document
   */
  async add(data: Partial<T>, useServerTimestamp = true): Promise<string> {
    if (!data) {
      throw new Error(`Invalid data for ${this.collectionName}`);
    }

    const userId = getCurrentUserId();
    const collectionRef = collection(db, 'users', userId, this.collectionName);

    const timestamp = useServerTimestamp
      ? {
          date: Timestamp.now(),
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
        }
      : {};

    const docRef = await addDoc(collectionRef, {
      ...data,
      ...timestamp,
    });

    return docRef.id;
  }

  /**
   * Get all documents from the collection
   * @param maxResults - Maximum number of results to return
   * @returns - Array of documents with their IDs
   */
  async getAll(maxResults?: number): Promise<(T & { id: string })[]> {
    const userId = getCurrentUserId();
    if (!userId) throw new Error('User not authenticated');

    const collectionRef = collection(db, 'users', userId, this.collectionName);
    const q = maxResults
      ? query(collectionRef, orderBy('date', 'desc'), limit(maxResults))
      : query(collectionRef, orderBy('date', 'desc'));

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as T),
    }));
  }

  /**
   * Get a document by its ID
   * @param docId - Document ID to fetch
   * @returns - Document data with its ID or null if not found
   */
  async getById(docId: string): Promise<(T & { id: string }) | null> {
    if (!docId) {
      throw new Error(`Invalid ID for fetching ${this.collectionName}`);
    }
    try {
      const userId = getCurrentUserId();
      if (!userId) throw new Error('User not authenticated');

      const documentRef = doc(db, 'users', userId, this.collectionName, docId);
      const documentSnapshot = await getDoc(documentRef);

      if (!documentSnapshot.exists()) {
        return null;
      }
      return {
        id: documentSnapshot.id,
        ...(documentSnapshot.data() as T),
      };
    } catch (error) {
      console.error(
        `Error fetching ${this.collectionName} document ${docId}:`,
        error,
      );
      return null;
    }
  }

  /**
   * Update an existing document
   * @param docId - Document ID to update
   * @param data - Data to update
   * @returns - True if the update was successful
   */
  async update(docId: string, data: Partial<T>): Promise<boolean> {
    if (!docId || !data) {
      throw new Error(`Invalid parameters for update ${this.collectionName}`);
    }

    const userId = getCurrentUserId();
    const documentRef = doc(db, 'users', userId, this.collectionName, docId);

    await updateDoc(documentRef, {
      ...data,
      updatedAt: Timestamp.now(),
    });

    return true;
  }

  /**
   * Delete a document from the collection
   * @param docId - Document ID to delete
   * @returns - True if the deletion was successful
   */
  async delete(docId: string): Promise<boolean> {
    if (!docId) {
      throw new Error(`Invalid ID for delete ${this.collectionName}`);
    }

    const userId = getCurrentUserId();
    const documentRef = doc(db, 'users', userId, this.collectionName, docId);

    await deleteDoc(documentRef);
    return true;
  }

  /**
   * Get documents within a date range
   * @param startDate - Start date of the range
   * @param endDate - End date of the range
   * @param dateField - Field to filter by date (default: 'date')
   * @returns - Array of documents with their IDs
   */
  async getByDateRange(
    startDate: Date,
    endDate: Date,
    dateField = 'date',
  ): Promise<(T & { id: string })[]> {
    if (!startDate || !endDate) {
      throw new Error(
        `Invalid date parameters for ${this.collectionName} date range query`,
      );
    }

    const userId = getCurrentUserId();
    const collectionRef = collection(db, 'users', userId, this.collectionName);

    const q = query(
      collectionRef,
      where(dateField, '>=', Timestamp.fromDate(startDate)),
      where(dateField, '<=', Timestamp.fromDate(endDate)),
      orderBy(dateField, 'desc'),
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as T),
    }));
  }

  /**
   * Get documents for a specific day
   * @param date - Date to filter by
   * @param dateField - Field to filter by date (default: 'date')
   * @returns - Array of documents with their IDs
   */
  async getByDate(
    date: Date,
    dateField = 'date',
  ): Promise<(T & { id: string })[]> {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    return this.getByDateRange(startOfDay, endOfDay, dateField);
  }

  /**
   * Execute a custom query with provided filters
   * @param filters - Array of filters to apply
   * @param orderByField - Field to order results by
   * @param orderDirection - Direction to order results
   * @param limitCount - Maximum number of results to return
   * @returns - Array of documents with their IDs
   */
  async query(
    filters: IQueryFilter[] = [],
    orderByField = 'date',
    orderDirection: 'asc' | 'desc' = 'desc',
    limitCount?: number,
  ): Promise<(T & { id: string })[]> {
    const userId = getCurrentUserId();
    const collectionRef = collection(db, 'users', userId, this.collectionName);

    const queryConstraints: QueryConstraint[] = [
      ...filters.map((filter) =>
        where(filter.field, filter.operator, filter.value),
      ),
      orderBy(orderByField, orderDirection),
    ];

    if (limitCount) {
      queryConstraints.push(limit(limitCount));
    }

    const q = query(collectionRef, ...queryConstraints);
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as T),
    }));
  }
}
