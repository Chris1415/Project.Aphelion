// Client-safe component map for App Router

import { BYOCClientWrapper, NextjsContentSdkComponent, FEaaSClientWrapper } from '@sitecore-content-sdk/nextjs';
import { Form } from '@sitecore-content-sdk/nextjs';

import * as PromoBand from 'src/components/PromoBand/PromoBand';
import * as NewsletterCTA from 'src/components/NewsletterCTA/NewsletterCTA';
import * as Hero from 'src/components/Hero/Hero';
import * as ContactForm from 'src/components/ContactForm/ContactForm';

export const componentMap = new Map<string, NextjsContentSdkComponent>([
  ['BYOCWrapper', BYOCClientWrapper],
  ['FEaaSWrapper', FEaaSClientWrapper],
  ['Form', Form],
  ['PromoBand', { ...PromoBand }],
  ['NewsletterCTA', { ...NewsletterCTA }],
  ['Hero', { ...Hero }],
  ['ContactForm', { ...ContactForm }],
]);

export default componentMap;
