export function parseMimeType(mimeType) {

  //Normalise Mime Types coming from the grid.
  switch(mimeType) {
    case "jpg":
      return "image/jpeg";
    case "png":
      return "image/png";
  }

  return mimeType;
}


function parseAsset(asset) {
  return {
    imageUrl: asset.secureUrl,
    mimeType: parseMimeType(asset.mimeType),
    width: asset.dimensions.width,
    height: asset.dimensions.height
  };
}

export function parseImageFromGridCrop(cropData) {
  return {
    assets: cropData.assets.map(parseAsset),
    imageId: cropData.specification.uri
  };
}

export function findSmallestAsset(assetsArray) {
  return assetsArray.reduce((smallestAsset, newAsset) => {
    if (newAsset.size < smallestAsset.size) {
      return newAsset;
    } else {
      return smallestAsset;
    }
  });
}

export function findSmallestAssetAboveWidth(assetsArray, minSize = 250) {
  // Grid provides various versions of a crop
  // their widths are fixed and typically 140, 500, 1000, 2000px
  // use the first one that's above `minSize` in width
  // as the resolution is usually good enough for a simple preview
  const usefulAssets = assetsArray.filter((asset) => asset.width > minSize);
  return findSmallestAsset(usefulAssets);
}

export function gridUrlFromApiUrl(url) {
  return url.replace("https://api.media.", "https://media.");
}
