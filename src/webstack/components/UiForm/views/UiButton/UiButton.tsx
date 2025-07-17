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
  onEnter?: (e: any) => void;
  onLeave?: (e: any) => void;
  disabled?: boolean;
  busy?: boolean;
  href?: string;
  target?: string;
  size?: IFormControlSize;
  type?: "button" | "submit" | "reset" | 'tel' | 'email';
  variant?: IFormControlVariant;
}


interface IButtonContext extends IButton {
  context: IButton;
}

const ButtonContext = ({ context }: IButtonContext) => {
  let traits = context.traits ?? {};
  traits['disabled'] = context.disabled;

  const handleClick = (e: any) => {
    context?.onClick?.(e);
  };

  const handleEnter = (e: any) => {
    context?.onEnter?.(e);
  };

  const handleLeave = (e: any) => {
    context?.onLeave?.(e);
  };

  if (context?.disabled) context.variant = 'disabled';

  const _type: any = context?.type && !['tel', 'email'].includes(context.type) ? context.type : undefined;

  return (
    <>
      <style jsx>{styles}</style>
      <FormControl label={context.label} size={context.size} variant={context.variant} traits={traits}>
        <button
          data-element="button"
          type={_type}
          className={typeof context?.variant === "string" ? context.variant : ""}
          onClick={handleClick}
          onMouseEnter={handleEnter}
          onMouseLeave={handleLeave}
          onTouchStart={handleEnter}
          onTouchEnd={handleLeave}
          disabled={context?.disabled || context?.variant === "disabled"}
        >
          {context?.busy ? (
            <div className="busy-spinner">
              <UiIcon icon="spinner" />
            </div>
          ) : (
            context?.children
          )}
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
  type,
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
          <ButtonContext context={{ type, onClick, children, variant,size, disabled, busy, traits, label }} />
        </LinkProvider>
      </>
    );

  return <ButtonContext context={{ onClick, children, variant,size, disabled, busy, traits, label }} />;
};

export default UiButton;
