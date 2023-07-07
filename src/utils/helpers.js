import _ from 'lodash';
import {moment} from "./moment";
import React from "react";
import {constants} from "../config";

export function getAvatar(path) {
  if (path) return path;
  else return require('../images/default-avatar.png');
}

export function fixImgPath(path) {
  if (!path) return '';
  if (path.includes('http')) return path;
  return constants.AWS_URL + path;
}

export function getProjectLogo(path) {
  if (path) return fixImgPath(path);
  else return require('../images/logo.jpg').default;
}

export function getNotNullFields(data) {
  const out = {};
  _(data).forEach((value, key) => {
    if (!_.isEmpty(value) || _.isBoolean(value) || _.isNumber(value)) {
      out[key] = value;
    }
  });
  return out;
}

export function isDatesSame(date1, date2) {
  const dateOne = moment(date1).format('YYYY-MM-DD');
  return moment(moment(date2).format('YYYY-MM-DD')).isSame(dateOne)
}

export const getTemptId = function () {
  return '_' + Math.random().toString(36).substr(2, 9);
};

export function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function getExt(type) {
  const re = /(?:\/([^/]+))?$/;
  return re.exec(type)[1];
}

export function humanFileSize(size) {
  const i = Math.floor(Math.log(size) / Math.log(1024));
  return (size / Math.pow(1024, i)).toFixed(2) * 1 + ' ' + ['B', 'KB', 'MB', 'GB', 'TB'][i];
}

export function openFile(src, type) {
  if (type === 'image/png' || type === 'image/jpeg') return null;
  else
    window.open(constants.AWS_URL + src, "_blank")
}

export function isImg(file) {
  return file.type === 'image/png' || file.type === 'image/jpeg';
}

export function mapFileData(file) {
  return {
    _id: getTemptId(),
    src: URL.createObjectURL(file),
    name: file.name,
    size: file.size,
    type: file.type
  }
}

export function delay(ms) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(2);
    }, ms);
  });
}

export function sortConversations(a, b) {
  return new Date(b.message?.createdAt || b.createdAt) - new Date(a.message?.createdAt || a.createdAt)
}

export function validateEmail(email) {
  return email.match(
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  );
}

export const mapMessageData = messages => {
  return messages.map(msg => ({
    ...msg,
    ...(msg.image ? {image: fixImgPath(msg.image)} : {}),
    user: {...msg.user, ...(msg.user.avatar ? {avatar: fixImgPath(msg.user.avatar)} : {})}
  }));
};

export const getFileName = filename => {
  if (filename.length > 20) return filename.substring(0, 20) + '.' + filename.split('.').pop();
  else return filename;
};
