import React, { useEffect } from "react";
import styles from "./UiButton.scss";
import { UiIcon } from "@webstack/components/UiIcon/controller/UiIcon";
import type { NextComponentType, NextPageContext } from "next";
import FormControl, { IFormControl as IFormControl, IFormControlSize } from "@webstack/components/UiForm/components/FormControl/FormControl";
import Link from "next/link";
import type { FC } from "react";
import { IFormControlVariant } from "../../../AdapTable/models/IVariant";
import { useRouter } from "next/router";

interface ILinkProvider {
  href?: string;
  target?: string;
  children?: React.ReactElement | React.ReactFragment;
  rel?: string;
  formControl?: boolean;
}

export const LinkProvider: FC<ILinkProvider> = ({ href, target, children, rel, formControl = true }) => {
  if (!href) return <>NO HREF</>;
  if (formControl)
    return (<>
      <style jsx>{styles}</style>
      <FormControl variant="inherit" >
        <Link className="ui-button__link-provider" href={href} target={target} rel={rel ? rel : "noopener noreferrer"}>
          {children}
        </Link>
      </FormControl>
    </>
    );
  return (
    <>
      <style jsx>{styles}</style>
      <Link href={href} target={target} rel={rel ? rel : "noopener noreferrer"} style={{ width: "100%" }}>
        {children}
      </Link>
    </>
  );
};
export interface IButton extends IFormControl {
  onClick?: (e: any) => void;
  onChange?: (e: any) => void;
  disabled?: boolean;
  busy?: boolean;
  href?: string;
  name?: string;
  target?: string;
  value?: any;
  size?: IFormControlSize;
  type?: "button" | "submit" | "reset" | "tel" | "email" | "checkbox" | "file";
  variant?: IFormControlVariant;
}

interface IButtonContext extends IButton {
  context: IButton;
}

const ButtonContext = ({ context }: IButtonContext) => {
  let traits = context.traits ? context.traits : {};
  traits['disabled'] = context.disabled;
  const handleClick = (e:any) =>{
    context?.onClick && context?.onClick(e)
  }
  if(context?.disabled)context.variant='disabled';
  const _type: any = context?.type && !['tel', 'email'].includes(context.type) && context.type;
  useEffect(() => {}, [context]);
  return (
    <>
      <style jsx>{styles}</style>
      <FormControl label={context.label} size={context.size} variant={context.variant} traits={traits}>
        <button
          data-element='button'
          name={context?.name}
          value={context?.value}
          type={_type || undefined}
          className={context?.variant ? context?.variant : ""}
          onClick={handleClick}
          onChange={context?.onChange}
          disabled={context?.disabled || context?.variant == "disabled"}
        >
          {context?.busy && (
            <div className="busy-spinner">
              <UiIcon icon="spinner" />
            </div>
          )}
          {!context?.busy && context?.children|| 
          context?.label&&(
            `${context.label} ${context?.value}`
          )||''}
        </button>
      </FormControl>
    </>
  );
};

const UiButton: NextComponentType<NextPageContext, {}, IButton> = ({
  href,
  target,
  onClick,
  children,
  variant,
  disabled,
  busy,
  traits,
  label,
  value,
  type,
  name,
  size
}: IButton) => {
  const router = useRouter();
  if(href && href !== '/' && router.asPath == href){
    disabled = true
  }

  if (href)
    return (
      <>
        <style jsx>{styles}</style>
        <LinkProvider href={href} target={target} formControl={false}>
          <ButtonContext context={{ name, value, type, onClick, children, variant,size, disabled, busy, traits, label }} />
        </LinkProvider>
      </>
    );

  return <ButtonContext context={{ name, value, onClick, children, variant,size, disabled, busy, traits, label }} />;
};

export default UiButton;
