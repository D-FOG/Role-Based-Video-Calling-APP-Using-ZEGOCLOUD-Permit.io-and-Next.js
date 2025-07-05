import { Permit } from 'permitio';

export const permit = new Permit({
  // Docker Container is running on port 7766
  pdp: "http://localhost:7766",
  //pdp: 'https://cloudpdp.api.permit.io',
  // The permit api token environment variable (add to .env file)
  token: process.env.NEXT_PUBLIC_PERMIT_API_KEY,
});