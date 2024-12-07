export interface Sitter {
  appuser_id: number;
  sitter_profile_bio: string;
  sitter_bio_picture_src_list: string;
  id: number | null;
  aggregate_sitter_rating: number;
  profile_bio: string;
  bio_picture_src_list: string;
  sitter_house_ok: boolean;
  owner_house_ok: boolean;
  visit_ok: boolean;
  dogs_ok: boolean;
  cats_ok: boolean;
  fish_ok: boolean;
  birds_ok: boolean;
  rabbits_ok: boolean;
}

export interface AppUserDetails {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  last_login: string;
  account_created: string;
  last_updated: string;
  profile_picture_src: string;
  prefecture: string;
  city_ward: string;
  street_address: string;
  postal_code: string;
  account_language: string;
  english_ok: boolean;
  japanese_ok: boolean;
}

export interface AppUser {
  average_user_rating: number | null | undefined;
  sitter: Sitter;
  appuser: AppUserDetails;
  appuser_id: number;
  sitter_bio_picture_src_list: string | undefined;
  sitter_profile_bio: string;
  visit_ok: boolean;
  rabbits_ok: boolean;
  birds_ok: boolean;
  fish_ok: boolean;
  cats_ok: boolean;
  dogs_ok: boolean;
  profile_bio: string;
  bio_picture_src_list: string | undefined;
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  last_login: string;
  account_created: string;
  last_updated: string;
  profile_picture_src: string;
  prefecture: string;
  city_ward: string;
  street_address: string;
  postal_code: string;
  account_language: string;
  english_ok: boolean;
  japanese_ok: boolean;
  sitter_id: number | null;
  owner_id: number | null;
  sitter_profile: Sitter;
}

export interface Inquiry {
  id: number;
  owner_appuser_id: number;
  sitter_appuser_id: number;
  inquiry_status: string;
  start_date: string;
  end_date: string;
  desired_service: string;
  pet_id_list: string | null;
  additional_info: string | null;
  inquiry_submitted: Date;
  inquiry_finalized: Date;
}

export interface PetProfileData {
  id: number;
  name: string;
  type_of_animal: string;
  subtype: string | null;
  weight: number | null;
  birthday: string;
  known_allergies: string | null;
  medications: string | null;
  special_needs: string | null;
  appuser_id: number;
  profile_picture_src: string | undefined;
  gender: string | undefined;
  pet_bio_picture_src_list: string | undefined;
}

export interface Review {
  id: number;
  author_appuser_id: number;
  recipient_appuser_type: string;
  comment: string;
  score: number;
  recipient_appuser_id: number;
  submission_date: Date;
}

export interface Message {
  id: number;
  inquiry_id: number;
  author_appuser_id: number;
  recipient_appuser_id: number;
  content: string;
  time_sent: Date;
  sender_name?: string;
}

export interface Availability {
  id: number;
  appuser: number;
  available_date: Date;
}
