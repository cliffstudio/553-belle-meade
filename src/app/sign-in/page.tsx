import { getSession } from "@/sanity/utils/auth";
import { redirect } from "next/navigation";
import { auth } from "./actions";
import { clientNoCdn } from "../../../sanity.client";
import { pageQuery } from "../../sanity/lib/queries";
import SignInHeroMedia from "../../components/SignInHeroMedia";
import BodyClassProvider from "../../components/BodyClassProvider";

interface Props {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function SignIn(props: Props) {
  const searchParams = await props.searchParams;
  const session = await getSession();

  if (session.isAuthenticated) {
    redirect("/");
  }

  // Fetch sign-in page content from CMS
  const page = await clientNoCdn.fetch(pageQuery, { slug: 'sign-in' }, {
    next: { revalidate: 0 }
  });

  if (!page || page.pageType !== 'sign-in') {
    // Fallback if page doesn't exist in CMS
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
