declare module "react-hook-form" {
  export type FieldValues = Record<string, any>;
  export type FieldPath<TFieldValues extends FieldValues = FieldValues> = Extract<keyof TFieldValues, string>;
  export type ControllerProps<
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
  > = {
    name: TName;
    control: any;
    render: (props: any) => any;
    defaultValue?: any;
    rules?: any;
  };
  export function Controller(props: any): any;
  export function FormProvider(props: any): any;
  export function useFormContext(): any;
}
