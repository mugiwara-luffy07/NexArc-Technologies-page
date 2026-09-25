import { getServices } from "./content";

/** Lightweight service list for nav and footer. */
export const services = getServices().map(({ slug, short, title }) => ({ slug, short, title }));
