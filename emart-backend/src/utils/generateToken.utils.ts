import JWT from 'jsonwebtoken';

export const generateAccessToken = (id:number) => {
    return JWT.sign({ id: id }, process.env.JWT_ACCESS_TOKEN_SECRET!, { expiresIn: '1m' });
}
export const generateRefreshToken = (id: number) => {
    return JWT.sign({ id:id }, process.env.JWT_REFRESH_TOKEN_SECRET!, { expiresIn: '1d'});
}

