import { Button as BaseButton } from "@base-ui/react/button";
import styles from "./Button.module.css";

type Props = React.ComponentProps<typeof BaseButton>;

export function Button({ className, ...props }: Props) {
  return (
    <BaseButton className={`${styles.button} ${className ?? ""}`} {...props} />
  );
}
