# Map/GIS View

The MVP includes a lightweight asset location view for each opportunity. It uses manually entered latitude and longitude from the Opportunity record and displays the location in an embedded OpenStreetMap iframe.

## How To Use It

1. Open an opportunity.
2. Add latitude and longitude in decimal degrees.
3. Save the opportunity.
4. Open the opportunity Map page.
5. Use the OpenStreetMap or Google Maps external links for quick review.

## What V1 Does

- Displays the asset name, asset type, status, and location fields.
- Shows an OpenStreetMap embed when coordinates are available.
- Shows latitude and longitude.
- Provides external links to OpenStreetMap and Google Maps.
- Does not require paid map APIs or API keys.

## What V1 Does Not Do

This is not a full GIS system. It does not perform:

- Land analysis.
- Pipeline analysis.
- Substation analysis.
- Road analysis.
- Fiber analysis.
- Environmental constraints analysis.
- Interconnection analysis.
- Parcel ownership review.
- Site suitability modeling.

## Future GIS Layers

Future versions may add GIS layers for:

- Pipelines.
- Substations.
- Roads.
- Industrial loads.
- Data centers.
- Land parcels.
- Environmental constraints.
- Interconnection constraints.
