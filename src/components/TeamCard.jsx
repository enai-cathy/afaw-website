import React from "react";
import "../styles/TeamCard.css";

const TeamCard = ({ full_name, image_url, alt, position, role, socials }) => {

  const normalizeUrl = (url) => {
    if (!url) return null;
    const trimmed = url.trim();
    if (/^https?:\/\//i.test(trimmed)) return trimmed;
    return `https://${trimmed}`;
  };

  const getPlatform = (url = "") => {
    const u = url.toLowerCase();
    if (u.includes("linkedin")) return "LinkedIn";
    if (u.includes("facebook") || u.includes("fb.")) return "Facebook";
    if (u.includes("instagram")) return "Instagram";
    if (u.includes("x.com") || u.includes("twitter")) return "X";
    if (u.includes("tiktok") || u.includes("tiktok.com")) return "TikTok";
    return "Website";
  };

  const getIconClass = (url = "") => {
    const u = url.toLowerCase();
    if (u.includes("linkedin")) return "fab fa-linkedin";
    if (u.includes("facebook") || u.includes("fb.")) return "fab fa-facebook-f";
    if (u.includes("instagram")) return "fab fa-instagram";
    if (u.includes("x.com") || u.includes("twitter")) return "fab fa-twitter";
    if (u.includes("tiktok") || u.includes("tiktok.com")) return "fab fa-tiktok";
    return "fas fa-link";
  };

  const url = normalizeUrl(socials);
  const platform = getPlatform(socials);
  const iconClass = socials ? getIconClass(socials) : null;

  return (
    <div className="col-lg-3 col-md-6 col-12">
      {/* Single Team Member */}
      <div className="single-news team-card">
        <div className="news-head team-card__image-container">
          <img
            src={image_url}
            alt={alt || full_name}
            className="team-card__image"
          />

        </div>
        <div className="news-body">
          <div className="news-content mx-2">
            <h2 className="team-card__name">{full_name}</h2>
            {position && <p className="text team-card__position">{position}</p>}
            {role && <p className="text team-card__role">{role}</p>}
          </div>
        </div>

        {url && iconClass && (
            <div className="team-card__social" aria-hidden={false}>
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Visit ${full_name}'s ${platform} profile`}
                title={`${platform} — ${full_name}`}
              >
                <i className={iconClass} aria-hidden="true"></i>
              </a>
            </div>
          )}

        <span className="team-card__underline" aria-hidden="true"></span>
      </div>
      {/* End Single Team Member */}
    </div>
  );
};

export default TeamCard;
