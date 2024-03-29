import cookie from 'cookie'
export default async (req, res) => {
   if ((req.method = 'get')) {
      const cookies = cookie.parse(req.headers.cookie ?? '')
      const access = cookies.access ?? false
      const refresh = cookies.refresh ?? false

      if (access === false || refresh === false) {
         return res.status(403).json({
            error: true,
            message: 'User is not authorized to access this page.1',
         })
      }

      try {
         const resAPI = await fetch(`${process.env.NEXT_PUBLIC_SERVER_HOST}/token/verify/`, {
            method: 'POST',
            headers: {
               Accept: 'application/json',
               'Content-Type': 'application/json',
            },
            body: JSON.stringify({ token: access }),
         })
         console.log('res', resAPI)
         if (resAPI.status == 200) {
            const res_user = await fetch(`${process.env.NEXT_PUBLIC_SERVER_HOST}/user/me/`, {
               method: 'get',
               headers: {
                  Accept: 'application/json',
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${access}`,
               },
            })

            return res.status(200).json({
               error: false,
               message: 'access token is valid',
               user: await res_user.json(),
            })
         }
         if (resAPI.status == 401) {
            const req_refresh = await fetch(`${process.env.NEXT_PUBLIC_SERVER_HOST}/token/refresh/`, {
               method: 'POST',
               headers: {
                  Accept: 'application/json',
                  'Content-Type': 'application/json',
               },
               body: JSON.stringify({ refresh: access }),
            })
            if (req_refresh.status == 200) {
               const access_data = req_refresh.json()
               res.setHeader('Set-cookie', {
                  access: access_data?.access,
               })
            }
         }
         return res.status(403).json({
            error: true,
            message: 'access token is invalid',
         })
      } catch (e) {
         return res.status(403).json({
            error: true,
            message: `User is not authorized to access this page.2${e}`,
         })
      }
   }
}
