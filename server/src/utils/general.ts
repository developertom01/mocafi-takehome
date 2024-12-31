import { ZodError } from "zod";

export function formatValidationErrors(err: any) {
  if (typeof err === "string") {
    return { message: err };
  }

  if (err instanceof ZodError && "issues" in err) {
    const errors: any = {};

    for (const issue of err.issues) {
      if (issue.path.length > 0) {
        const field = issue.path[0];
        let message: string;
        if (issue.message === "Required") {
          message = `${field} is required`;
        } else {
          message = issue.message;
        }
        errors[field] = message;
      }
    }
    return errors;
  }

  return err;
}
