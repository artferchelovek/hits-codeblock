import "../../..//M3KIT/light.css";

interface TextProps extends React.HTMLProps<HTMLParagraphElement> {
  type?: "display" | "headline" | "body" | "label" | "title";
  sizeType?: "large" | "medium" | "small";
  color?:
    | "on-primary"
    | "on-secondary"
    | "on-primary-container"
    | "on-secondary-container"
    | "on-surface"
    | "on-background";
}

export const Text: React.FC<TextProps> = ({
  type = "body",
  sizeType = "medium",
  color = "on-primary",
  children,
  style,
  ...props
}: TextProps) => {
  const getColor = (colorName: string) => {
    const colorMap: Record<string, string> = {
      "on-primary": "--md-sys-color-on-primary",
      "on-secondary": "--md-sys-color-on-secondary",
      "on-primary-container": "--md-sys-color-on-primary-container",
      "on-secondary-container": "--md-sys-color-on-secondary-container",
      "on-surface": "--md-sys-color-on-surface",
      "on-background": "--md-sys-color-on-background",
    };

    const variable = colorMap[colorName] || "--md-sys-color-on-surface";
    return `var(${variable})`;
  };

  const getStyles = () => {
    const basedStyles: React.CSSProperties = {
      color: getColor(color),
      fontFamily: "Inter, sans-serif",
      margin: 0,
      padding: 0,
    };
    switch (type) {
      case "display":
        switch (sizeType) {
          case "large":
            return {
              ...basedStyles,
              fontSize: "57px",
              lineHeight: "64px",
              letterSpacing: "-0.25px",
            };
          case "medium":
            return {
              ...basedStyles,
              fontSize: "45px",
              lineHeight: "52px",
              letterSpacing: "0px",
            };
          case "small":
            return {
              ...basedStyles,
              fontSize: "36px",
              lineHeight: "44px",
              letterSpacing: "0px",
            };
        }
      case "headline":
        switch (sizeType) {
          case "large":
            return {
              ...basedStyles,
              fontSize: "32px",
              lineHeight: "40px",
            };
          case "medium":
            return {
              ...basedStyles,
              fontSize: "28px",
              lineHeight: "36px",
            };
          case "small":
            return {
              ...basedStyles,
              fontSize: "24px",
              lineHeight: "32px",
            };
        }
      case "body":
        switch (sizeType) {
          case "large":
            return {
              ...basedStyles,
              fontSize: "16px",
              lineHeight: "24px",
            };
          case "medium":
            return {
              ...basedStyles,
              fontSize: "14px",
              lineHeight: "20px",
            };
          case "small":
            return {
              ...basedStyles,
              fontSize: "12px",
              lineHeight: "16px",
            };
        }
      case "label":
        switch (sizeType) {
          case "large":
            return {
              ...basedStyles,
              fontSize: "14px",
              lineHeight: "20px",
            };
          case "medium":
            return {
              ...basedStyles,
              fontSize: "12px",
              lineHeight: "16px",
            };
          case "small":
            return {
              ...basedStyles,
              fontSize: "11px",
              lineHeight: "16px",
            };
        }
      case "title":
        switch (sizeType) {
          case "large":
            return {
              ...basedStyles,
              fontSize: "22px",
              lineHeight: "28px",
            };
          case "medium":
            return {
              ...basedStyles,
              fontSize: "16px",
              lineHeight: "24px",
            };
          case "small":
            return {
              ...basedStyles,
              fontSize: "14px",
              lineHeight: "20px",
            };
        }
    }
  };

  const styles = getStyles();

  return (
    <p style={{ ...styles, ...style }} {...props}>
      {children}
    </p>
  );
};
