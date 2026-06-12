// Below are built-in components that are available in the app, it's recommended to keep them as is

import { BYOCServerWrapper, NextjsContentSdkComponent, FEaaSServerWrapper } from '@sitecore-content-sdk/nextjs';
import { Form } from '@sitecore-content-sdk/nextjs';

// end of built-in components
import * as RichTextSection from 'src/components/RichTextSection/RichTextSection';
import * as PromoBand from 'src/components/PromoBand/PromoBand';
import * as Promo from 'src/components/Promo/Promo';
import * as PageHero from 'src/components/PageHero/PageHero';
import * as NewsletterCTA from 'src/components/NewsletterCTA/NewsletterCTA';
import * as DestinationsGrid from 'src/components/DestinationsGrid/DestinationsGrid';
import * as ContactForm from 'src/components/ContactForm/ContactForm';

export const componentMap = new Map<string, NextjsContentSdkComponent>([
  ['BYOCWrapper', BYOCServerWrapper],
  ['FEaaSWrapper', FEaaSServerWrapper],
  ['Form', { ...Form, componentType: 'client' }],
  ['RichTextSection', { ...RichTextSection }],
  ['PromoBand', { ...PromoBand, componentType: 'client' }],
  ['Promo', { ...Promo, componentType: 'client' }],
  ['PageHero', { ...PageHero }],
  ['NewsletterCTA', { ...NewsletterCTA, componentType: 'client' }],
  ['DestinationsGrid', { ...DestinationsGrid }],
  ['ContactForm', { ...ContactForm, componentType: 'client' }],
]);

export default componentMap;
