const configuredEndpoint = import.meta.env.VITE_EMRS_API_URL;

export const EMRS_SUBMIT_URL = configuredEndpoint || (
  import.meta.env.DEV
    ? "/api/emrs"
    : `${window.location.protocol}//${window.location.hostname}:5000/api/emrs`
);