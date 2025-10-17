import stytch from "stytch";

export const loadStytch = () => {
  try {
    const stytchClient = new stytch.Client({
      project_id: process.env.STYTCH_PROJECT_ID as string,
      secret: process.env.STYTCH_PROJECT_SECRET as string,
    });
    return stytchClient;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to load Stytch client");
  }
};
