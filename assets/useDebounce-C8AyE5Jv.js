import{r as o}from"./vendor-react-b1n3RH4y.js";function n(e,t){const[r,u]=o.useState(e);return o.useEffect(()=>{const s=setTimeout(()=>{u(e)},t);return()=>{clearTimeout(s)}},[e,t]),r}export{n as u};
