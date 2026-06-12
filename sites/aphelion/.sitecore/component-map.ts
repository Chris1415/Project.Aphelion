// Below are built-in components that are available in the app, it's recommended to keep them as is

import { BYOCServerWrapper, NextjsContentSdkComponent, FEaaSServerWrapper } from '@sitecore-content-sdk/nextjs';
import { Form } from '@sitecore-content-sdk/nextjs';

// end of built-in components
import * as ValueProps from 'src/components/ValueProps/ValueProps';
import * as Testimonials from 'src/components/Testimonials/Testimonials';
import * as StatsBand from 'src/components/StatsBand/StatsBand';
import * as RowSplitter from 'src/components/RowSplitter/RowSplitter';
import * as RichTextSection from 'src/components/RichTextSection/RichTextSection';
import * as PromoBand from 'src/components/PromoBand/PromoBand';
import * as Promo from 'src/components/Promo/Promo';
import * as PageHero from 'src/components/PageHero/PageHero';
import * as NewsletterCTA from 'src/components/NewsletterCTA/NewsletterCTA';
import * as Marquee from 'src/components/Marquee/Marquee';
import * as ExperienceShowcase from 'src/components/ExperienceShowcase/ExperienceShowcase';
import * as DestinationsGrid from 'src/components/DestinationsGrid/DestinationsGrid';
import * as Container from 'src/components/Container/Container';
import * as ContactForm from 'src/components/ContactForm/ContactForm';
import * as ContactDetails from 'src/components/ContactDetails/ContactDetails';
import * as ColumnSplitter from 'src/components/ColumnSplitter/ColumnSplitter';

export const componentMap = new Map<string, NextjsContentSdkComponent>([
  ['BYOCWrapper', BYOCServerWrapper],
  ['FEaaSWrapper', FEaaSServerWrapper],
  ['Form', { ...Form, componentType: 'client' }],
  ['ValueProps', { ...ValueProps }],
  ['Testimonials', { ...Testimonials }],
  ['StatsBand', { ...StatsBand, componentType: 'client' }],
  ['RowSplitter', { ...RowSplitter }],
  ['RichTextSection', { ...RichTextSection }],
  ['PromoBand', { ...PromoBand, componentType: 'client' }],
  ['Promo', { ...Promo, componentType: 'client' }],
  ['PageHero', { ...PageHero }],
  ['NewsletterCTA', { ...NewsletterCTA, componentType: 'client' }],
  ['Marquee', { ...Marquee }],
  ['ExperienceShowcase', { ...ExperienceShowcase }],
  ['DestinationsGrid', { ...DestinationsGrid }],
  ['Container', { ...Container }],
  ['ContactForm', { ...ContactForm, componentType: 'client' }],
  ['ContactDetails', { ...ContactDetails }],
  ['ColumnSplitter', { ...ColumnSplitter }],
]);

export default componentMap;
