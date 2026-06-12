// Client-safe component map for App Router

import { BYOCClientWrapper, NextjsContentSdkComponent, FEaaSClientWrapper } from '@sitecore-content-sdk/nextjs';
import { Form } from '@sitecore-content-sdk/nextjs';

import * as StatsBand from 'src/components/StatsBand/StatsBand';
import * as PromoBand from 'src/components/PromoBand/PromoBand';
import * as Promo from 'src/components/Promo/Promo';
import * as NewsletterCTA from 'src/components/NewsletterCTA/NewsletterCTA';
import * as ContactForm from 'src/components/ContactForm/ContactForm';

export const componentMap = new Map<string, NextjsContentSdkComponent>([
  ['BYOCWrapper', BYOCClientWrapper],
  ['FEaaSWrapper', FEaaSClientWrapper],
  ['Form', Form],
  ['StatsBand', { ...StatsBand }],
  ['PromoBand', { ...PromoBand }],
  ['Promo', { ...Promo }],
  ['NewsletterCTA', { ...NewsletterCTA }],
  ['ContactForm', { ...ContactForm }],
]);

export default componentMap;
