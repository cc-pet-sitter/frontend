import { useForm } from "react-hook-form";
import { useState } from "react";
import Rating from "@mui/material/Rating";
import { Inquiry, Review } from "../../types/userProfile";
import { useAuth } from "../../contexts/AuthContext";
import { useTranslation } from "react-i18next";

const apiURL: string = import.meta.env.VITE_API_BASE_URL;

interface WriteReviewProps {
  booking: Inquiry;
  onClose: () => void;
  recipientType: string
}

interface ReviewForm {
  comment: string;
}

const WriteReview: React.FC<WriteReviewProps> = ({ booking, onClose, recipientType }) => {
  const { register, handleSubmit } = useForm<ReviewForm>();
  const [ratingValue, setRatingValue] = useState<number | null>(null);

  const { currentUser } = useAuth();

  const { t } = useTranslation();

  console.log(booking);

  const inputClass =
    "appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white";
  const labelClass =
    "block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2";

  const onReviewSubmit = async (data: ReviewForm) => {
    let isReviewOfSitter = recipientType === "sitter";
    let authorID = isReviewOfSitter ? booking.owner_appuser_id : booking.sitter_appuser_id;
    let recipientID = isReviewOfSitter ? booking.sitter_appuser_id : booking.owner_appuser_id;

    const review: Review = {
      id: 0,
      author_appuser_id: authorID,
      recipient_appuser_type: recipientType,
      recipient_appuser_id: recipientID,
      comment: data.comment,
      score: ratingValue || 0,
      submission_date: new Date(),
    };

    try {
      const idToken = await currentUser?.getIdToken();
      const response = await fetch(
        `${apiURL}/appuser/${recipientID}/review`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${idToken}`,
          },
          body: JSON.stringify(review),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to submit review");
      }

      alert("Review submitted.");
      onClose();
    } catch (error) {
      console.error("Error submitting review:", error);
      alert("Cannot leave zero stars");
    }
  };

  return (
    <div className="flex justify-center p-8">
      <form
        onSubmit={handleSubmit(onReviewSubmit)}
        className="w-full max-w-lg "
      >
        <div className="md:flex md:items-center">
          <label className={`${labelClass} block`}>{t("review_input_page.rating")}</label>
          <div className="md:w-1/2 flex justify-center py-6">
            <Rating
              name="simple-controlled"
              value={ratingValue}
              onChange={(_event, ratingValue) => {
                setRatingValue(ratingValue);
              }}
            />
          </div>
        </div>
        <div className="mb-6">
          <label className={`${labelClass} block`} htmlFor="comment">
            {t("review_input_page.comment")}
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
            <button type="submit" className="btn-primary">
              {t("review_input_page.submit")}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default WriteReview;
