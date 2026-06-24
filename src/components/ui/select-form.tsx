"use client"

import * as React from "react"
import { Controller, ControllerProps, FieldPath, FieldValues } from "react-hook-form"
import { Select, SelectProps, SelectValue } from "./select"
import { cn } from "@/lib/utils"

// ─── Internal form primitives ─────────────────────────────────────────────────

function FormLabel({
  children,
  required,
  htmlFor,
  className,
}: {
  children: React.ReactNode
  required?: boolean
  htmlFor?: string
  className?: string
}) {
  return (
    <label
      htmlFor={htmlFor}
      className={cn("text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70", className)}
    >
      {children}
      {required && (
        <span aria-hidden className="ml-0.5 text-destructive">
          *
        </span>
      )}
    </label>
  )
}

function FormDescription({ children, id, className }: { children: React.ReactNode; id?: string; className?: string }) {
  return (
    <p id={id} className={cn("text-xs text-muted-foreground", className)}>
      {children}
    </p>
  )
}

function FormMessage({ children, id, className }: { children: React.ReactNode; id?: string; className?: string }) {
  return (
    <p
      id={id}
      role="alert"
      aria-live="polite"
      data-gjs-select-form-error=""
      className={cn("text-xs font-medium text-destructive", className)}
    >
      {children}
    </p>
  )
}

// ─── SelectFormField ──────────────────────────────────────────────────────────

export interface SelectFormFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
  V extends SelectValue = string,
> extends Omit<SelectProps<V>, "value" | "onChange" | "onBlur" | "id" | "status" | "aria-invalid" | "aria-describedby"> {
  control: ControllerProps<TFieldValues, TName>["control"]
  name: TName
  label?: React.ReactNode
  required?: boolean
  description?: React.ReactNode
  /** Manual status override — "error" is automatically set when the field has a validation error */
  status?: SelectProps<V>["status"]
  className?: string
}

/**
 * SelectFormField wraps Select with react-hook-form Controller.
 * Automatically sets status="error", aria-invalid, and renders
 * the Zod/RHF validation message below the select.
 */
export function SelectFormField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
  V extends SelectValue = string,
>({
  control,
  name,
  label,
  required,
  description,
  status: statusProp,
  className,
  ...selectProps
}: SelectFormFieldProps<TFieldValues, TName, V>) {
  const fieldId = React.useId()
  const errorId = `${fieldId}err`
  const descId = `${fieldId}desc`

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        const hasError = !!fieldState.error
        const resolvedStatus = hasError ? "error" : statusProp
        const describedBy = [description ? descId : null, hasError ? errorId : null]
          .filter(Boolean)
          .join(" ") || undefined

        return (
          <div className={cn("flex flex-col gap-1.5", className)}>
            {label && (
              <FormLabel htmlFor={fieldId} required={required}>
                {label}
              </FormLabel>
            )}
            <Select
              {...(selectProps as SelectProps<V>)}
              id={fieldId}
              value={field.value as V | V[] | null}
              onChange={(val) => field.onChange(val)}
              onBlur={field.onBlur}
              status={resolvedStatus}
              aria-invalid={hasError}
              aria-describedby={describedBy}
            />
            {description && !hasError && (
              <FormDescription id={descId}>{description}</FormDescription>
            )}
            {hasError && (
              <FormMessage id={errorId}>{fieldState.error?.message}</FormMessage>
            )}
          </div>
        )
      }}
    />
  )
}
