﻿using Task01.Model;

namespace UserApi.Services
{
    public interface ICardService
    {
        IEnumerable<UserCard> GetAllCards(int userId);
        UserCard AddCard(UserCard userCard);
        void SetDefaultCard(int userId, int cardId);

        UserCard GetDefaultCard(int userId);

        void UpdateCard(int cardId, UserCard userCard);
    }
}
