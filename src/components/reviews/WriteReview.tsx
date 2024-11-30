import { useForm } from "react-hook-form";
import { useState } from "react";
import Rating from "@mui/material/Rating";

interface ReviewForm {
  comment: string;
}

const WriteReview = () => {
  const { register, handleSubmit } = useForm<ReviewForm>();
  const [ratingValue, setRatingValue] = useState<number | null>(2);

  const inputClass =
    "appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white";
  const labelClass =
    "block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2";

  const onReviewSubmit = (data: ReviewForm) => {
    const review = {
      ...data,
      rating: ratingValue,
    };

    console.log("Submitted review:", review);
    // send to the server here
  };

  return (
    <div className="flex justify-center p-8">
      <form
        onSubmit={handleSubmit(onReviewSubmit)}
        className="w-full max-w-lg "
      >
        <div className="md:flex md:items-center">
          <label className={`${labelClass} block`}>{"Give your rating:"}</label>
          <div className="md:w-1/2 flex justify-center py-10">
            <Rating
              name="simple-controlled"
              size="large"
              value={ratingValue}
              onChange={(_event, ratingValue) => {
                setRatingValue(ratingValue);
              }}
            />
          </div>
        </div>
        <div className="mb-6">
          <label className={`${labelClass} block`} htmlFor="comment">
            {"Comments:"}
          </label>
          <textarea
            id="comment"
            className={inputClass}
            rows={4}
            cols={40}
            {...register("comment")}
          />
        </div>

        <div className="md:flex md:items-center">
          <div className="md:w-1/2 flex justify-center">
            <button
              type="submit"
              className="shadow bg-gray-500 hover:bg-gray-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded"
            >
              {"Submit"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default WriteReview;
