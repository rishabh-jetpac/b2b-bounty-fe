- in current packs screen we render all available packs in one place, the pack includes both country and pack data.
### update
- render list of destinations first, api response get from fetching `https://nlb-ap-southeast-1.jetpacstaging.com/v1/b2b/enterprise/catalog/revamp/destinations`.
use virtualizelist to render, as it is 200 items to render.
- on clicking destination open packs page
get reponse(list of packs for destination) from: `https://nlb-ap-southeast-1.jetpacstaging.com/v1/b2b/enterprise/catalog/revamp/items?pageName=united-states-of-america-esim`; this is the real api we will be using. 
- on destination there will be search.
- on packs screen no search required.
- days wise sectioned list.
- unlimited, then decresing days.
