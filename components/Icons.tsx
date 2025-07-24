import React from 'react';

// Create wrapper components for React Icons to fix JSX return type issues
export const SearchIcon: React.FC<{ className?: string; onClick?: () => void }> = ({ className, onClick }) => {
  const AiOutlineSearch = require('react-icons/ai').AiOutlineSearch;
  return React.createElement(AiOutlineSearch, { className, onClick });
};

export const BellIcon: React.FC<{ className?: string }> = ({ className }) => {
  const AiFillBell = require('react-icons/ai').AiFillBell;
  return React.createElement(AiFillBell, { className });
};

export const NetflixIcon: React.FC<{ className?: string }> = ({ className }) => {
  const RiNetflixFill = require('react-icons/ri').RiNetflixFill;
  return React.createElement(RiNetflixFill, { className });
};

export const ChevronLeftIcon: React.FC<{ className?: string; onClick?: () => void }> = ({ className, onClick }) => {
  const BiChevronLeftCircle = require('react-icons/bi').BiChevronLeftCircle;
  return React.createElement(BiChevronLeftCircle, { className, onClick });
};

export const ChevronRightIcon: React.FC<{ className?: string; onClick?: () => void }> = ({ className, onClick }) => {
  const BiChevronRightCircle = require('react-icons/bi').BiChevronRightCircle;
  return React.createElement(BiChevronRightCircle, { className, onClick });
};

export const BookmarkDashIcon: React.FC<{ className?: string }> = ({ className }) => {
  const BsFillBookmarkDashFill = require('react-icons/bs').BsFillBookmarkDashFill;
  return React.createElement(BsFillBookmarkDashFill, { className });
};

export const BookmarkCheckIcon: React.FC<{ className?: string }> = ({ className }) => {
  const BsFillBookmarkCheckFill = require('react-icons/bs').BsFillBookmarkCheckFill;
  return React.createElement(BsFillBookmarkCheckFill, { className });
};

export const RemoveCircleIcon: React.FC<{ className?: string; onClick?: () => void }> = ({ className, onClick }) => {
  const IoIosRemoveCircle = require('react-icons/io').IoIosRemoveCircle;
  return React.createElement(IoIosRemoveCircle, { className, onClick });
};

export const AddCircleIcon: React.FC<{ className?: string; onClick?: () => void }> = ({ className, onClick }) => {
  const IoIosAddCircle = require('react-icons/io').IoIosAddCircle;
  return React.createElement(IoIosAddCircle, { className, onClick });
};

export const EducationIcon: React.FC<{ className?: string }> = ({ className }) => {
  const MdCastForEducation = require('react-icons/md').MdCastForEducation;
  return React.createElement(MdCastForEducation, { className });
};

export const MailIcon: React.FC<{ className?: string }> = ({ className }) => {
  const AiFillMail = require('react-icons/ai').AiFillMail;
  return React.createElement(AiFillMail, { className });
};

export const GitPullRequestIcon: React.FC<{ className?: string }> = ({ className }) => {
  const GoGitPullRequest = require('react-icons/go').GoGitPullRequest;
  return React.createElement(GoGitPullRequest, { className });
};

export const PlayCircleIcon: React.FC<{ className?: string }> = ({ className }) => {
  const AiFillPlayCircle = require('react-icons/ai').AiFillPlayCircle;
  return React.createElement(AiFillPlayCircle, { className });
};

export const InformationCircleIcon: React.FC<{ className?: string }> = ({ className }) => {
  const IoMdInformationCircleOutline = require('react-icons/io').IoMdInformationCircleOutline;
  return React.createElement(IoMdInformationCircleOutline, { className });
};

export const StarIcon: React.FC<{ className?: string }> = ({ className }) => {
  const AiFillStar = require('react-icons/ai').AiFillStar;
  return React.createElement(AiFillStar, { className });
};

export const CalendarIcon: React.FC<{ className?: string }> = ({ className }) => {
  const AiFillCalendar = require('react-icons/ai').AiFillCalendar;
  return React.createElement(AiFillCalendar, { className });
};

export const ClockIcon: React.FC<{ className?: string }> = ({ className }) => {
  const AiFillClockCircle = require('react-icons/ai').AiFillClockCircle;
  return React.createElement(AiFillClockCircle, { className });
};

export const LocationIcon: React.FC<{ className?: string }> = ({ className }) => {
  const AiFillEnvironment = require('react-icons/ai').AiFillEnvironment;
  return React.createElement(AiFillEnvironment, { className });
};

export const PlayIcon: React.FC<{ className?: string }> = ({ className }) => {
  const BsFillPlayFill = require('react-icons/bs').BsFillPlayFill;
  return React.createElement(BsFillPlayFill, { className });
};

export const CheckIcon: React.FC<{ className?: string }> = ({ className }) => {
  const HiCheckCircle = require('react-icons/hi').HiCheckCircle;
  return React.createElement(HiCheckCircle, { className });
};

export const PlusIcon: React.FC<{ className?: string }> = ({ className }) => {
  const HiPlusCircle = require('react-icons/hi').HiPlusCircle;
  return React.createElement(HiPlusCircle, { className });
};