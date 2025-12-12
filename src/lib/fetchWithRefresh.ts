// src/lib/fetchWithRefresh.js
export async function fetchWithRefresh(url, options = {}) {
     let res = await fetch(url, options);
   
     if (res.status === 401) {
       // try refreshing
       const refreshRes = await fetch("/api/refresh", {
         method: "POST",
         credentials: "include",
       });
   
       if (!refreshRes.ok) {
         window.location.href = "/login";
         return;
       }
   
       const { access } = await refreshRes.json();
       const headers = { ...options.headers, Authorization: `Bearer ${access}` };
   
       res = await fetch(url, { ...options, headers });
     }
   
     return res;
   }
   