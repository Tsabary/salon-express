import "./styles.scss";
import React from "react";

const PrivacyPolicy = () => {
  const policy = {
    __html: `<h1>Welcome to our Privacy Policy</h1><h3>Your privacy is critically important to us.</h3>Salon Express is located at:<br/><address> Salon Express<br/>34 Happardes St. Ganot <br />5029300 - HaMerkaz , Israel<br/>0547206806</address><p>It is Salon Express's policy to respect your privacy regarding any information we may collect while operating our website. This Privacy Policy applies to <a href="https://salon.express">https://salon.express</a> (hereinafter, "us", "we", or "https://salon.express"). We respect your privacy and are committed to protecting personally identifiable information you may provide us through the Website. We have adopted this privacy policy ("Privacy Policy") to explain what information may be collected on our Website, how we use this information, and under what circumstances we may disclose the information to third parties. This Privacy Policy applies only to information we collect through the Website and does not apply to our collection of information from other sources.</p><p>This Privacy Policy, together with the Terms and conditions posted on our Website, set forth the general rules and policies governing your use of our Website. Depending on your activities when visiting our Website, you may be required to agree to additional terms and conditions.</p><h2>Website Visitors</h2><p>Like most website operators, Salon Express collects non-personally-identifying information of the sort that web browsers and servers typically make available, such as the browser type, language preference, referring site, and the date and time of each visitor request. Salon Express's purpose in collecting non-personally identifying information is to better understand how Salon Express's visitors use its website. From time to time, Salon Express may release non-personally-identifying information in the aggregate, e.g., by publishing a report on trends in the usage of its website.</p><p>Salon Express also collects potentially personally-identifying information like Internet Protocol (IP) addresses for logged in users and for users leaving comments on https://salon.express blog posts. Salon Express only discloses logged in user and commenter IP addresses under the same circumstances that it uses and discloses personally-identifying information as described below.</p><h2>Gathering of Personally-Identifying Information</h2><p>Certain visitors to Salon Express's websites choose to interact with Salon Express in ways that require Salon Express to gather personally-identifying information. The amount and type of information that Salon Express gathers depends on the nature of the interaction. For example, we ask visitors who sign up for a blog at https://salon.express to provide a username and email address.</p><h2>Security</h2><p>The security of your Personal Information is important to us, but remember that no method of transmission over the Internet, or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your Personal Information, we cannot guarantee its absolute security.</p><h2>Links To External Sites</h2><p>Our Service may contain links to external sites that are not operated by us. If you click on a third party link, you will be directed to that third party's site. We strongly advise you to review the Privacy Policy and terms and conditions of every site you visit.</p><p>We have no control over, and assume no responsibility for the content, privacy policies or practices of any third party sites, products or services.</p><h2>Aggregated Statistics</h2><p>Salon Express may collect statistics about the behavior of visitors to its website. Salon Express may display this information publicly or provide it to others. However, Salon Express does not disclose your personally-identifying information.</p><h2>Cookies</h2><p>To enrich and perfect your online experience, Salon Express uses "Cookies", similar technologies and services provided by others to display personalized content, appropriate advertising and store your preferences on your computer.</p><p>A cookie is a string of information that a website stores on a visitor's computer, and that the visitor's browser provides to the website each time the visitor returns. Salon Express uses cookies to help Salon Express identify and track visitors, their usage of https://salon.express, and their website access preferences. Salon Express visitors who do not wish to have cookies placed on their computers should set their browsers to refuse cookies before using Salon Express's websites, with the drawback that certain features of Salon Express's websites may not function properly without the aid of cookies.</p><p>By continuing to navigate our website without changing your cookie settings, you hereby acknowledge and agree to Salon Express's use of cookies.</p><h2>Privacy Policy Changes</h2><p>Although most changes are likely to be minor, Salon Express may change its Privacy Policy from time to time, and in Salon Express's sole discretion. Salon Express encourages visitors to frequently check this page for any changes to its Privacy Policy. Your continued use of this site after any change in this Privacy Policy will constitute your acceptance of such change.</p> <h2></h2> <p></p><h2>Contact Information</h2><p>If you have any questions about this Privacy Policy, please contact us via <a href="mailto:yanay.tsabary@gmail.com">email</a> or <a href="tel:+972547206806">phone</a>.</p>`,
  };

  return (
    <div className="privacy">
      <div>Last updated: May 2nd, 2020</div>
      <div>
        <div>
          By using our site you agree to the Privacy Policy bellow, and to the
          Privacy Policy of the compeny "8×8", who provides the video
          conference.
        </div>
        <a
          href="https://jitsi.org/meet-jit-si-privacy/"
          target="_blank"
          rel="noopener noreferrer"
        >
          To read "8×8" Privacy Policy click here
        </a>
      </div>

      <div className="tiny-margin-top">
        <div>
          If you are streaming content using one of the providers we allow on
          Salon.express, you must comply to the Privacy Policy of that
          provider. Any violations of those terms would be settled between the
          prosecuter, the streamer and the stream provider.
        </div>

        <div className="extra-tiny-margin-top">
          <a
            href="https://www.twitch.tv/p/legal/privacy-notice/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Twitch terms and conditions
          </a>
        </div>
        <div className="extra-tiny-margin-top">
          <a
            href="https://www.youtube.com/about/policies"
            target="_blank"
            rel="noopener noreferrer"
          >
            Youtube terms and conditions
          </a>
        </div>
        <div className="extra-tiny-margin-top">
          <a
            href="https://mixlr.com/privacy/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Mixlr privacy policy
          </a>
        </div>
      </div>

      <div dangerouslySetInnerHTML={policy} />
    </div>
  );
};

export default PrivacyPolicy;
