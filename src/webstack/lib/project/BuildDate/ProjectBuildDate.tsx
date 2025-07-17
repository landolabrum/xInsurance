import createBuildDate from "@webstack/helpers/createBuildDate";
import environment from "~/src/core/environment";

export default function ProjectBuildDate() {
  const name = environment.merchant.name;
  const about = environment.merchant.settings?.about;

  return (
    <>
      {/* This part is safe for SEO */}
      <span style={{ display: 'none' }}>
        {name} | {about?.title} | {about?.description}
      </span>

      {/* This part is NOT rendered in the DOM, only logged */}
      {typeof window !== "undefined" && process.env.NODE_ENV !== "production" && (
        console.info(`[DATE] ${createBuildDate()}`)
      )}
    </>
  );
}
