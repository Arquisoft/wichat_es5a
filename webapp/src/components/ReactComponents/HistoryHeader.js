import React from 'react';
import CustomH1 from '../ReactComponents/CustomH1';

const HistoryHeader = ({ user, userCount, questionCount, t }) => {
  return (
    <>
      {user === null ? (
        <>
          <CustomH1>{t("history")}</CustomH1>
          <CustomH1 size="h5">
            <span>{t("total-users")}: {userCount}</span>
          </CustomH1>
          <CustomH1 size="h5">
            <span>{t("questions-generated")}: {questionCount}</span>
          </CustomH1>
        </>
      ) : (
        <CustomH1>
          {t("user-history")} {user}
        </CustomH1>
      )}
    </>
  );
};

export default HistoryHeader;