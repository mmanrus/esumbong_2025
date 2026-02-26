
const cookieName = process.env.COOKIE_NAME
if (!cookieName) {
    throw new Error("COOKIE_NAME is not set in the variable")
}

export const COOKIE_NAME = cookieName;

