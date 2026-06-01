import { getSession } from "@/sanity/utils/auth";
import { redirect } from "next/navigation";
import { auth } from "./actions";
import SignInHeroMedia from "../../components/SignInHeroMedia";
import BodyClassProvider from "../../components/BodyClassProvider";
import type { Metadata } from 'next';
import { buildMetadata } from "../../utils/metadata";
import { getPage } from "../../sanity/lib/pages";

interface Props {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage('sign-in')
  return buildMetadata(page?.seo, page?.title);
}

export default async function SignIn(props: Props) {
  const searchParams = await props.searchParams;
  const session = await getSession();

  if (session.isAuthenticated) {
    redirect("/");
  }

  const page = await getPage('sign-in')

  if (page?.pageType === 'sign-in' && !page.signInPageEnabled) {
    redirect("/");
  }

  if (!page || page.pageType !== 'sign-in') {
    return (
      <>
        <BodyClassProvider pageType="sign-in" slug={undefined} />
        <SignInHeroMedia
          auth={auth}
          redirect={searchParams.redirect}
        />
      </>
    );
  }

  return (
    <>
      <BodyClassProvider pageType="sign-in" slug={page.slug?.current} />
      {page.signInHero && (
        <SignInHeroMedia
          {...page.signInHero}
          auth={auth}
          redirect={searchParams.redirect}
        />
      )}
    </>
  );
}
