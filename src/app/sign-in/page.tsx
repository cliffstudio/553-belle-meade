import { getSession } from "@/sanity/utils/auth";
import { redirect } from "next/navigation";
import { auth } from "./actions";
import { clientNoCdn } from "../../../sanity.client";
import { homepageQuery } from "../../sanity/lib/queries";
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

  // Fetch homepage hero data
  const homepage = await clientNoCdn.fetch(homepageQuery, {}, {
    next: { revalidate: 0 }
  });

  return (
    <>
      <BodyClassProvider pageType="sign-in" slug={homepage?.slug?.current} />
      {homepage?.homepageHero && (
        <SignInHeroMedia 
          {...homepage.homepageHero} 
          auth={auth}
          redirect={searchParams.redirect}
        />
      )}
    </>
  );
}
