import styled from "@emotion/styled";

export const EmojiCategoryWrap = styled.ul`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  left: 50%;
  width: calc(100%);
  margin: 0 0px 30px 0px;
  /* background-color: rgba(252, 243, 251, 0.4); */
  background: ${({ dark }) =>
    dark
      ? "linear-gradient(to bottom, rgba(230, 179, 247, 0.3), rgba(211, 188, 232, 0.3), rgba(194, 193, 238, 0.3))"
      : "rgba(252,243,251,0.4)"};
  gap: 10px;
  padding: 20px 0;
  border-radius: 16px;
`;
export const EmojiCategoryItem = styled.li`
  border: 1px solid #e7e7e7;
  padding: 15px 30px;
  width: auto;
  border-radius: 24px;
  cursor: pointer;
  white-space: nowrap;
  transform: translateY(-5px);

  /* background-color: ${({ isActive }) =>
    isActive ? "#fad4e8" : "transparent"}; */
  background: ${({ isActive, dark }) => {
    if (isActive) {
      // 활성 상태일 때 배경
      return dark
        ? `linear-gradient(
          to right,
          rgb(30, 27, 39),
          rgb(37, 37, 77),
          rgb(51, 51, 110),
          rgb(58, 58, 116),
          rgb(73, 61, 120),
          rgb(84, 71, 131)
        )`
        : "#fad4e8";
    } else {
      // 비활성 상태 배경
      return dark
        ? "linear-gradient(to bottom, rgba(230, 179, 247, 0.3), rgba(211, 188, 232, 0.3), rgba(194, 193, 238, 0.3))"
        : "rgba(252,243,251,0.4)";
    }
  }};
  box-shadow: ${({ isActive }) =>
    isActive ? "6px 6px 8px rgba(0,0,0,0.15" : "none"};

  &:hover {
    /* background-color: #fad4e8; */
    background: ${({ dark }) =>
      dark
        ? `linear-gradient(
          to right,
          rgb(30, 27, 39),
          rgb(37, 37, 77),
          rgb(51, 51, 110),
          rgb(58, 58, 116),
          rgb(73, 61, 120),
          rgb(84, 71, 131)
        )`
        : "#fad4e8"};
    box-shadow: 6px 6px 8px rgba(0, 0, 0, 0.15);
  }
`;

export const ListWrap = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin: 0;
  padding: 0;
`;
export const ListItem = styled.li`
  position: relative;
  display: flex;
  flex-direction: column;
  /* background-color: rgba(252, 243, 251, 0.4); */
  background: ${({ dark }) =>
    dark
      ? "linear-gradient(to bottom, rgba(230, 179, 247, 0.3), rgba(211, 188, 232, 0.3), rgba(194, 193, 238, 0.3))"
      : "rgba(252,243,251,0.4)"};
  width: 100%;
  border-radius: 24px;
  padding: 20px;
  gap: 7px;
  transition:
    background-color 0.3s ease,
    box-shadow 0.3s ease,
    transform 0.3s ease;
  cursor: pointer;
  &:hover {
    /* background-color: #fad4e8; */
    background: ${({ dark }) =>
      dark
        ? `linear-gradient(
          to bottom,
          rgb(30, 27, 39),
          rgb(37, 37, 77),
          rgb(51, 51, 110),
          rgb(58, 58, 116),
          rgb(73, 61, 120),
          rgb(84, 71, 131)
        )`
        : "#fad4e8"};
    box-shadow: 6px 6px 8px rgba(0, 0, 0, 0.15);
    transform: translateY(-2px);
  }
`;
export const ListItemUser = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;
export const ListItemUserPhoto = styled.div`
  display: flex;
  justify-content: center;
  width: 35px;
  height: 35px;
  border-radius: 8px;
  overflow: hidden;
  margin-left: 30px;
  padding: 0;
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;
export const ListItemUserName = styled.p`
  border-radius: 24px;
  background-color: #fdebfd;
  padding: 10px;
  color: #8672d0;
  font-size: 13px;
  font-weight: 600;
`;
export const ListItemTime = styled.span`
  /* color: #8672d0; */
  color: ${({ dark }) => (dark ? "#fcf3fb" : "#493d78")};
`;
export const ListItemTitle = styled.h3`
  margin-left: 30px;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 16px;
`;
export const ListItemCategory = styled.span`
  border: 1px solid #c2c2c2;
  border-radius: 16px;
  background-color: #fcf3fb;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #8672d0;
  padding: 5px 8px;
  font-weight: 400;
  font-size: 13px;
`;
export const ListItemDetail = styled.div`
  margin: 0 30px;
  height: 50px;
  border-bottom: 1px solid #544783;
  font-size: 14px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.7;
`;
export const ListItemDelete = styled.div`
  padding: 0;
  margin: 5px 30px 0 0;
  width: 15px;
  height: 17px;
  overflow: hidden;
  align-self: flex-end;
  transform: translateX(-30px);
  cursor: pointer;
  img {
    object-fit: cover;
    width: 100%;
    height: 100%;
  }
`;
export const ListItemFavorites = styled.div`
  position: absolute;
  top: 25px;
  right: 70px;
  cursor: pointer;
`;

export const List = {
  EmojiCategoryWrap,
  EmojiCategoryItem,
  ListWrap,
  ListItem,
  ListItemUser,
  ListItemUserPhoto,
  ListItemUserName,
  ListItemTime,
  ListItemTitle,
  ListItemCategory,
  ListItemDetail,
  ListItemDelete,
  ListItemFavorites,
};
