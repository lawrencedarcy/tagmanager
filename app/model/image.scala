package model

import play.api.libs.json._
import play.api.libs.functional.syntax._
import com.gu.tagmanagement.{Image => ThriftImage, ImageAsset => ThriftImageAsset}


case class Image(imageId: String, assets: List[ImageAsset]) {
  def asThrift = ThriftImage(
    imageId = imageId,
    assets = assets.map(_.asThrift)
  )
  def asXml = {
    <imageId>{this.imageId}</imageId>
    <assets>{this.assets.map(_.asXml)}</assets>
  }
}

object Image {
  implicit val imageFormat: Format[Image] = (
    (JsPath \ "imageId").format[String] and
      (JsPath \ "assets").formatNullable[List[ImageAsset]].inmap[List[ImageAsset]](_.getOrElse(Nil), Some(_))
    )(Image.apply, unlift(Image.unapply))

  def apply(thriftImage: ThriftImage): Image = Image(
    imageId = thriftImage.imageId,
    assets = thriftImage.assets.map(ImageAsset(_)).toList
  )
}




case class ImageAsset(imageUrl: String, width: Long, height: Long, mimeType: String) {
  def asThrift = ThriftImageAsset(imageUrl, width, height, mimeType)
  def asXml = {<imageAsset>
    <imageUrl>{this.imageUrl}</imageUrl>
    <width>{this.width}</width>
    <height>{this.height}</height>
    <mimeType>{this.mimeType}</mimeType>
    </imageAsset>}
}

object ImageAsset {
  implicit val imageAssetFormat: Format[ImageAsset] = (
      (JsPath \ "imageUrl").format[String] and
      (JsPath \ "width").format[Long] and
      (JsPath \ "height").format[Long] and
      (JsPath \ "mimeType").format[String]

    )(ImageAsset.apply, unlift(ImageAsset.unapply))

  def apply(thriftImageAsset: ThriftImageAsset): ImageAsset = ImageAsset(
    imageUrl = thriftImageAsset.imageUrl,
    width = thriftImageAsset.width,
    height = thriftImageAsset.height,
    mimeType = thriftImageAsset.mimeType
  )
}
