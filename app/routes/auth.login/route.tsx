import { useState } from "react";
import { Form, useActionData, useLoaderData } from "react-router";
import type { Route } from "./+types/route";
import { login } from "../../shopify.server";
import { loginErrorMessage } from "./error.server";

export const loader = async ({ request }: Route.LoaderArgs) => {
  const errors = loginErrorMessage(await login(request));

  return { errors };
};

export const action = async ({ request }: Route.ActionArgs) => {
  const errors = loginErrorMessage(await login(request));

  return { errors };
};

export default function Auth() {
  const loaderData = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const [shop, setShop] = useState("");
  const { errors } = actionData || loaderData;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        fontFamily: "Inter, -apple-system, sans-serif",
      }}
    >
      <Form method="post" style={{ width: "20rem" }}>
        <h1 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>Log in</h1>
        <label
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "0.25rem",
            fontSize: "0.9rem",
          }}
        >
          <span>Shop domain</span>
          <input
            type="text"
            name="shop"
            value={shop}
            onChange={(event) => setShop(event.currentTarget.value)}
            autoComplete="on"
            placeholder="example.myshopify.com"
            style={{
              padding: "0.55rem 0.75rem",
              border: errors.shop ? "1px solid #d82c0d" : "1px solid #c9c9c9",
              borderRadius: "0.5rem",
              fontSize: "1rem",
            }}
          />
          <span style={{ color: "#777", fontSize: "0.8rem" }}>
            example.myshopify.com
          </span>
          {errors.shop && (
            <span style={{ color: "#d82c0d" }}>{errors.shop}</span>
          )}
        </label>
        <button
          type="submit"
          style={{
            marginTop: "1rem",
            padding: "0.55rem 1.25rem",
            border: "none",
            borderRadius: "0.5rem",
            background: "#1a1a1a",
            color: "#fff",
            fontSize: "1rem",
            cursor: "pointer",
          }}
        >
          Log in
        </button>
      </Form>
    </div>
  );
}
