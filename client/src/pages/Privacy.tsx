import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { LEGAL_CONTACT_EMAIL, LEGAL_LAST_UPDATED } from "@/lib/legal";
import LegalPage, { LegalSection } from "@/components/LegalPage";

export default function Privacy() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-1">
        <LegalPage title="Privacy Policy" updated={LEGAL_LAST_UPDATED}>
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 mb-10">
            <p className="text-gray-800 m-0">
              <strong>The short version.</strong> LearnQuest is not a running service
              yet. The only personal information we collect is an email address, and
              only if you choose to give us one on the pricing page. The practice demo
              runs entirely in your browser and sends us nothing at all.
            </p>
          </div>

          <LegalSection title="Who we are">
            <p>
              LearnQuest is a learning product currently in development. This website
              exists to describe what we are building, let people try a demo, and let
              interested people join a waitlist. It is not an operating service and we
              are not selling anything.
            </p>
            <p>
              You can reach us about anything on this page at{" "}
              <a
                href={`mailto:${LEGAL_CONTACT_EMAIL}`}
                className="text-blue-600 hover:underline"
              >
                {LEGAL_CONTACT_EMAIL}
              </a>
              .
            </p>
          </LegalSection>

          <LegalSection title="What we collect">
            <p>There are only three things, and most visitors trigger just the last one.</p>
            <ol>
              <li>
                <strong>Your email address and the plan you clicked</strong> — only when
                you submit the &ldquo;Notify Me&rdquo; form on the pricing page. We do
                not ask for your name, age, address, phone number or payment details, and
                there are no accounts or passwords on this site.
              </li>
              <li>
                <strong>A theme preference</strong> — stored in your own browser so the
                site remembers how you like it. It never leaves your device and is never
                sent to us.
              </li>
              <li>
                <strong>Standard server logs</strong> — our host records ordinary request
                information such as IP address, browser type and the time of the request.
                This happens automatically for any website and we use it only to keep the
                site working and secure.
              </li>
            </ol>
          </LegalSection>

          <LegalSection title="The practice demo collects nothing">
            <p>
              We want to be specific about this, because it is unusual. The multiplication
              demo runs completely inside your browser. It makes no network requests,
              saves nothing to your device, and sends us no information whatsoever — not
              your answers, not your score, not the fact that you played. Close the tab
              and it is gone. No sign-up is required and none is offered.
            </p>
          </LegalSection>

          <LegalSection title="Why we collect it and how long we keep it">
            <p>
              If you join the waitlist, we use your email address for exactly one purpose:
              to contact you about LearnQuest becoming available. We do not send
              newsletters, marketing from other companies, or anything you did not ask
              for.
            </p>
            <p>
              We keep waitlist addresses until we launch and have contacted you, or until
              you ask us to delete yours — whichever comes first. If the project is
              abandoned, we delete them.
            </p>
            <p>
              <strong>We do not sell your personal information, and we never have.</strong>{" "}
              We do not share it for advertising, and we do not use it to build a profile
              of you.
            </p>
          </LegalSection>

          <LegalSection title="Third parties that necessarily see something">
            <p>
              We use a small number of ordinary service providers to run this site. They
              are not permitted to use your information for their own purposes.
            </p>
            <ul>
              <li>
                <strong>Resend</strong> — our email provider. When you submit the waitlist
                form, your email address passes through Resend in order to notify us.
              </li>
              <li>
                <strong>Vercel</strong> — our web host. Vercel serves the site and keeps
                the standard server logs described above.
              </li>
              <li>
                <strong>Google Fonts</strong> — the site loads its typefaces from Google&rsquo;s
                servers, which means your browser contacts Google and Google receives your
                IP address as part of that request. If you would rather that did not
                happen, a content blocker will prevent it and the site will still work.
              </li>
            </ul>
          </LegalSection>

          <LegalSection title="Children">
            <p>
              LearnQuest is intended to help children learn, so we want to be careful and
              clear here.
            </p>
            <p>
              <strong>This website is for adults</strong> — parents, guardians, teachers
              and school staff. We do not knowingly collect personal information from
              anyone under 13. The waitlist form should only be filled in by an adult.
            </p>
            <p>
              A child can use the practice demo freely, because it asks for nothing and
              records nothing.
            </p>
            <p>
              If you believe a child has given us their email address, contact us at{" "}
              <a
                href={`mailto:${LEGAL_CONTACT_EMAIL}`}
                className="text-blue-600 hover:underline"
              >
                {LEGAL_CONTACT_EMAIL}
              </a>{" "}
              and we will delete it promptly.
            </p>
            <p>
              When we eventually build a product that children use with accounts, it will
              require verifiable parental consent and the other protections the
              Children&rsquo;s Online Privacy Protection Act (COPPA) requires.{" "}
              <strong>
                We are not claiming to have those protections in place today, because the
                service they would protect does not exist yet.
              </strong>
            </p>
          </LegalSection>

          <LegalSection title="Your choices">
            <p>
              Ask us to delete your email address and we will, without asking why. Write
              to{" "}
              <a
                href={`mailto:${LEGAL_CONTACT_EMAIL}`}
                className="text-blue-600 hover:underline"
              >
                {LEGAL_CONTACT_EMAIL}
              </a>{" "}
              and we will confirm once it is done. You can also ask us what we hold about
              you, which will be a short answer.
            </p>
            <p>
              Depending on where you live, you may have additional rights over your
              personal information. Ask us and we will honour them.
            </p>
          </LegalSection>

          <LegalSection title="Security">
            <p>
              Our main protection is that we collect almost nothing — an email address you
              chose to give us. We take reasonable steps to protect it, but no website can
              promise perfect security, and we are not going to pretend otherwise.
            </p>
          </LegalSection>

          <LegalSection title="Changes">
            <p>
              As LearnQuest is built, this policy will need to change — particularly
              before any product that children use directly becomes available. We will
              update the date at the top when it does. If the changes are significant and
              we have your email address, we will tell you.
            </p>
          </LegalSection>
        </LegalPage>
      </main>
      <Footer />
    </div>
  );
}
