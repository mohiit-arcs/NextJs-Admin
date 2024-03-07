export const config = {
    jwt: {
        secret: process.env.JWT_SECRET,
        expiry: Number(process.env.NEXT_PUBLIC_JWT_EXPIRY || "604800"),
    }
}