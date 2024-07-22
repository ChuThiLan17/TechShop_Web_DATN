import React, { useCallback, useEffect, useState } from "react";
import { Button, InputFrom, MarkdownEditor, Select } from "../../components";
import { useForm } from "react-hook-form";
import { apiCreateProduct, apiGetBrand, apiGetCategores } from "../../apis";
import { getBase64, validate } from "../../ultils/helper";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import icons from "../../ultils/icons";
import path from "../../ultils/path";

const CreateProducts = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState(null);
  const [brand, setBrand] = useState(null);
  const { MdClose } = icons;
  const fetchCategories = async () => {
    const response = await apiGetCategores();
    if (response.success) setCategories(response.createCategory);
  };
  const [preiew, setPreview] = useState({
    thumb: "",
    images: [],
  });
  const fetchBrand = async () => {
    const response = await apiGetBrand();
    if (response.success) setBrand(response.getBrand);
  };

  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
    watch,
  } = useForm({
    category: "",
    brand: "",
  });
  const [payload, setPayload] = useState({
    description: "",
  });
  const [hoverElm, setHoverElm] = useState(null);
  const [invalidFields, setInvalidFields] = useState([]);
  const changeValue = useCallback(
    (e) => {
      setPayload(e);
    },
    [payload]
  );

  const handleCreateProduct = async (data) => {
    const invalids = validate(payload, setInvalidFields);
    if (invalids === 0) {
      // if (data.category) {
      //   const categoryItem = categories?.find(
      //     (el) => el.title === data.category
      //   );
      //   if (categoryItem) {
      //     data.category = categoryItem._id;
      //     console.log(data.category);
      //   }
      // }
      const finalPayload = { ...data, ...payload };
      const formData = new FormData();
      for (let i of Object.entries(finalPayload)) formData.append(i[0], i[1]);
      if (finalPayload.thumb) formData.append("thumb", finalPayload.thumb[0]);
      if (finalPayload.images) {
        for (let image of finalPayload.images) formData.append("images", image);
      }
      console.log("formData", formData);
      const response = await apiCreateProduct(formData);
      if (response.success) {
        reset();
        setPayload({
          thumb: "",
          image: [],
        });
        navigate(`/${path.MANAGE_PRODUCTS}`);
      }
    }
  };

  const handlePreviewImages = async (files) => {
    const imagesPreview = [];
    for (let file of files) {
      if (
        file.type !== "image/png" &&
        file.type !== "image/jpg" &&
        file.type !== "image/jpeg" &&
        file.type !== "image/webp"
      ) {
        toast.warning("File not supported!");
        return;
      }
      const base64 = await getBase64(file);
      imagesPreview.push({ name: file.name, path: base64 });
    }
    setPreview((prev) => ({ ...prev, images: imagesPreview }));
  };

  const handlePreview = async (file) => {
    const base64Thumb = await getBase64(file);
    setPreview((prev) => ({ ...prev, thumb: base64Thumb }));
  };
  const handleDeteImg = (name) => {
    const files = [...watch("images")];
    reset({ images: files?.filter((el) => el.name !== name) });
    if (preiew.images?.some((el) => el.name === name))
      setPreview((prev) => ({
        ...prev,
        images: prev.images?.filter((el) => el.name != name),
      }));
  };
  useEffect(() => {
    fetchCategories();
    fetchBrand();
  }, []);
  useEffect(() => {
    handlePreview(watch("thumb")[0]);
  }, [watch("thumb")]);
  useEffect(() => {
    handlePreviewImages(watch("images"));
  }, [watch("images")]);

  return (
    <div className="w-full">
      <h1 className="h-[75px] flex justify-between items-center text-3xl font-bold px-4 border-b">
        <span>ManageUsers</span>
      </h1>
      <div className="p-4 ">
        <form onSubmit={handleSubmit(handleCreateProduct)}>
          <InputFrom
            label="Name product"
            register={register}
            errors={errors}
            id={"title"}
            validate={{
              required: "Cần nhập thông tin",
            }}
            placeholder="Tên sản phẩm mới"
          />
          <div className="w-full flex gap-[50px] my-8">
            <div className="flex-auto">
              <InputFrom
                label="Giá"
                register={register}
                errors={errors}
                id={"price"}
                fullwidth
                validate={{
                  required: "Cần nhập thông tin",
                }}
                style="flex-auto"
                placeholder="Giá sản phẩm mới"
                type="number"
              />
            </div>
            <div className="flex-auto">
              <InputFrom
                label="Số lương"
                register={register}
                errors={errors}
                id={"quantity"}
                fullwidth
                validate={{
                  required: "Cần nhập thông tin",
                }}
                style="flex-auto"
                placeholder="Giá sản phẩm mới"
                type="number"
              />
            </div>
            <div className="flex-auto">
              <InputFrom
                label="Màu"
                register={register}
                errors={errors}
                id={"color"}
                fullwidth
                validate={{
                  required: "Cần nhập thông tin",
                }}
                placeholder="Giá sản phẩm mới"
              />
            </div>
          </div>
          <div className="w-full flex gap-4 mt-5">
            <div className="flex-auto">
              <Select
                label="category"
                register={register}
                fullwidth
                style={"p-2 border  border-gray-950 "}
                errors={errors}
                id={"category"}
                validate={{
                  required: "Không được để trống",
                }}
                options={categories}
              />
            </div>
            <div className="flex-auto">
              <Select
                label="Hãng"
                register={register}
                fullwidth
                style={"p-2 border flex-auto  border-gray-950 "}
                errors={errors}
                id={"brand"}
                validate={{
                  required: "Không được để trống",
                }}
                options={brand}
              />
            </div>
          </div>

          <MarkdownEditor
            name="description"
            changeValue={changeValue}
            label="Description"
            invalidFields={invalidFields}
            setInvalidFields={setInvalidFields}
          />
          <div className="flex flex-col gap-2 mt-8">
            <label htmlFor="thumb">Upload ảnh</label>
            <input
              type="file"
              id="thumb "
              {...register("thumb", { required: "Thêm ảnh" })}
            />
            {errors["thumb"] && (
              <small className="text-red-600">{errors["thumb"]?.message}</small>
            )}
          </div>
          {preiew.thumb && (
            <div className="my-4">
              <img
                src={preiew.thumb}
                alt="hu"
                className="w-[200px] object-contain"
              />
            </div>
          )}
          <div className="flex flex-col gap-2 mt-8">
            <label htmlFor="products">Upload ảnh</label>
            <input
              type="file"
              id="products"
              multiple
              {...register("images", { required: "Thêm ảnh" })}
            />
            {errors["images"] && (
              <small className="text-red-600">
                {errors["images"]?.message}
              </small>
            )}
          </div>
          {preiew.images.length > 0 && (
            <div className="my-4 flex w-full gap-3 flex-wrap">
              {preiew.images?.map((el, idx) => (
                <div
                  onMouseEnter={() => setHoverElm(el.name)}
                  key={idx}
                  className="w-fit relative"
                  onMouseLeave={() => setHoverElm(null)}
                >
                  <img
                    key={idx}
                    src={el.path}
                    alt="Sản phẩm"
                    className="w-[200px] object-contain"
                  />
                  {hoverElm === el.name && (
                    <div
                      className=" inset-0  bg-red-50 absolute"
                      onClick={() => handleDeteImg(el.name)}
                    >
                      <MdClose size={24} color="black" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          <div className="mt-3">
            <Button type="submit" name="Thêm sản phẩm" />
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProducts;
