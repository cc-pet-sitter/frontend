export interface Sitter {
  appuser_id: number;
  sitter_profile_bio: string;
  sitter_bio_picture_src_list: string;
  id: number;
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
  pet_id_list: number[] | null;
  addtional_info: string | null;
  inquiry_submitted: Date;
  inquiry_finalized: Date;
}
