import { notFound } from "next/navigation";
import { NotFoundError } from "@/domain/errors";

/** Переводит доменное «не найдено» в страницу 404. */
export async function orNotFound<T>(result: Promise<T>): Promise<T> {
  try {
    return await result;
  } catch (error) {
    if (error instanceof NotFoundError) notFound();
    throw error;
  }
}
