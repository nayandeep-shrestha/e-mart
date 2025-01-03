import { NextFunction, Request, Response, Router } from 'express';
const router = Router();
import { signup, profile, refetch, logout, fetchRoles, initiatePasswordReset, changePassword, sendOTP, verifyOTP, changePasswordThroughOTP, resendOTP, storeLogin, adminlogin } from "../services/auth.service";
import { validateToken } from '../middleware/validateToken'
import HttpException from '../models/http-exception.model';


router.post('/signup', async (req: Request, res: Response, next: NextFunction) => {
    try {
        let userData = req.body;
        const user = await signup(userData)
        res.status(201).json({
            msg: "Account created successfully",
            result: user
        });

    } catch (error) {
        next(error)
    }
})

router.post('/admin/login', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = req.body;
        const loginResponse = await adminlogin(data);
        const { refreshToken, ...responseToSend } = loginResponse;
        res.cookie('refreshToken', loginResponse.refreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: 'strict'
        });

        res.status(200).json({
            msg: "Logged in successfully",
            result: responseToSend
        });
    } catch (error) {
        next(error);
    }
});
router.post('/store/login', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = req.body;
        const loginResponse = await storeLogin(data);
        const { refreshToken, ...responseToSend } = loginResponse;
        res.cookie('refreshToken', loginResponse.refreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: 'strict'
        });

        res.status(200).json({
            msg: "Logged in successfully",
            result: responseToSend
        });
    } catch (error) {
        next(error);
    }
});

router.get('/profile', validateToken, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const profileData = await profile(req.userId)
        res.status(200).json({
            msg: "Profile fetched",
            result: profileData
        })
    } catch (error) {
        next(error)
    }
})

router.get('/refetch', async (req: Request, res: Response, next: NextFunction) => {
    try {
        let refreshToken: string | undefined = req.cookies.refreshToken;
        if (!refreshToken) {
            throw new HttpException(400, "Authorization header is empty")
        }
        const newAccessToken: string = await refetch(refreshToken);
        res.status(200).json({
            msg: "New token fetched",
            result: {
                accessToken: newAccessToken
            }
        })

    } catch (error) {
        next(error)
    }
})

router.post('/logout', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const refreshToken: string | undefined = req.cookies.refreshToken;
        let accessToken: string | undefined = req.headers['authorization'];

        if (!refreshToken) {
            throw new HttpException(400, "Refresh token is missing from cookies");
        }

        if (!accessToken) {
            throw new HttpException(400, "Access token is missing");
        }

        let tokenParts = accessToken.split(" ")
        accessToken = tokenParts.pop()
        if (!accessToken) {
            throw new HttpException(401, 'Unauthorized')
        }

        const response: string = await logout(refreshToken, accessToken);
        res.clearCookie('refreshToken');
        res.status(200).json({
            msg: response
        });
    } catch (error) {
        next(error);
    }
});

router.get('/user-roles', validateToken, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const roles = await fetchRoles();
        res.status(200).json({
            msg: "Roles fetched successfully",
            result: roles
        })
    } catch (error) {
        next(error)
    }
})

router.post('/reset-link', async (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.body;
    if (!email) throw new HttpException(400, "Email not provided")

    try {
        await initiatePasswordReset(email);
        res.status(200).json({ msg: 'Password reset email sent' });
    } catch (error) {
        next(error)
    }
});

router.patch('/change-password', async (req: Request, res: Response, next: NextFunction) => {
    try{
        const { password, token} = req.body;
        await changePassword(token, password);
        res.status(201).json({msg: 'Password changed successfully'})
    }catch(error){
        next(error)
    }
})

router.post('/send-otp', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email } = req.body;

        const response = await sendOTP(email);
        res.status(200).json({
            msg: "OTP sent to your email",
            result: response
        });
    } catch (error) {
        next(error);
    }
});

router.post('/verify-otp', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id, otp } = req.body;
        if (!id || !otp) throw new HttpException(400, "Details are missing");

        const verifiedData = await verifyOTP(id, otp);
        res.status(200).json({
            msg: "Success",
            result: verifiedData
        });
    } catch (error) {
        next(error);
    }
});

router.patch('/change-password-otp', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { password, userId } = req.body;
        await changePasswordThroughOTP(userId, password);
        res.status(200).json({ msg: 'Password changed successfully' });
    } catch (error) {
        next(error);
    }
});

router.post('/resend-otp', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.body;

        const response = await resendOTP(id);
        res.status(200).json({
            msg: "OTP sent to your email",
            result: response
        });
    } catch (error) {
        next(error);
    }
});


export default router
