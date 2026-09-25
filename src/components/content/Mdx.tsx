import { MDXRemote } from "next-mdx-remote/rsc";
import Link from "next/link";
import type { ComponentProps } from "react";

const components = {
  a: ({ href = "", ...props }: ComponentProps<"a">) =>
    href.startsWith("/") ? <Link href={href} {...props} /> : <a href={href} target="_blank" rel="noopener noreferrer" {...props} />,
};

export function Mdx({ source }: { source: string }) {
  return (
    <div className="prose-nexarc">
      <MDXRemote source={source} components={components} />
    </div>
  );
}
