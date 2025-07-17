import { useRouter } from "next/router";
import { useEffect } from "react";
import styles from "./BreadCrumbs.scss";
import capitalize from "@webstack/helpers/Capitalize";
import { UiIcon } from "@webstack/components/UiIcon/controller/UiIcon";
import useWindow from "@webstack/hooks/window/useWindow";
import environment from "~/src/core/environment";
import keyStringConverter from "@webstack/helpers/keyStringConverter";

export type BreadCrumbLinkProps = {
  href?: string;
  label: string;
  blank?: boolean;
  onClick?: (e:any)=>void;
}
export interface BreadCrumbsProps {
  defaultLink?: BreadCrumbLinkProps;
  links?: BreadCrumbLinkProps[]
}
export default function BreadCrumbs({ defaultLink, links }: BreadCrumbsProps) {
  const router = useRouter();
  const width = useWindow().width;
  function handleClick(route: string) {
    // console.log("[ ROUTE ]",route)
    router.push(route)
  }

  const linkLen = links ? links.length - 1 : 0;
  useEffect(() => {
  }, [links, router]);
  return <>
    <style jsx >{styles}</style>
    <div className="breadcrumbs">
      <div className="crumb" onClick={() => defaultLink?.href&& handleClick(defaultLink.href) || handleClick( "/")}>
        {/* {defaultLink?.label || environment.merchant.name && keyStringConverter(String(environment.merchant.name))} <UiIcon icon="fa-chevron-right" /> */}
      </div>
      {links && width > 1100 && links.map((link, key) => {
        return <div key={key} onClick={() => key + 1 !== links.length && handleClick(link.href ? link.href : "/" + link.label)} className={`crumb ${key === linkLen ? "active" : ""}`}>
          {capitalize(link.label)} {key !== linkLen && <UiIcon icon="fa-chevron-right" />}
        </div>
      })}
      {width < 1100 && <div className="crumb active" onClick={router.back}>back</div>}
    </div>
  </>
}