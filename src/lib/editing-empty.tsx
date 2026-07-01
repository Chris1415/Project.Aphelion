import { JSX } from 'react';

/**
 * EditingEmpty — visible affordance shown in Pages EDIT MODE when an Integrated-GraphQL
 * container has no children yet. Without it the container renders nothing, so there's no
 * click target on the canvas to select the rendering / set its datasource. Renders nothing
 * when published. Lives in src/lib/ (NOT src/components/) so generate-map doesn't register it.
 */
export function EditingEmpty({
  component,
  child,
}: {
  component: string;
  child: string;
}): JSX.Element {
  return (
    <div className="editing-empty" role="note">
      <strong>{component}</strong> — no items yet. Select this rendering, set its datasource
      folder, then add <strong>{child}</strong> items to that folder (content tree).
    </div>
  );
}
