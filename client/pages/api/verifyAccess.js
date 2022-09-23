import cookie from 'cookie'
export default async (req, res) => {
   if ((req.method = 'get')) {
      const cookies = cookie.parse(req.headers.cookie ?? '')
      const access = cookies.access ?? false
      if (access === false) {
         return res.status(403).json({
            error: true,
            message: 'User is not authorized to access this page.1',
         })
      }

      try {
         const resAPI = await fetch(`${process.env.NEXT_PUBLIC_HOST}/token/verify/`, {
            method: 'POST',
            headers: {
               Accept: 'application/json',
               'Content-Type': 'application/json',
            },
            body: JSON.stringify({ token: access }),
         })
         if (resAPI.status == 200) {
            return res.status(200).json({
               error: false,
               message: 'access token is valid',
            })
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
