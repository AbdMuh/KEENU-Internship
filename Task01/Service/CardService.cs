using Microsoft.AspNetCore.Cors.Infrastructure;
using Microsoft.EntityFrameworkCore;
using Task01.Data;
using Task01.Model;

namespace UserApi.Services
{
    public class CardService : ICardService
    {
        private readonly ApplicationDBContext _context;

        public CardService(ApplicationDBContext context)
        {
            _context = context;
        }

        public IEnumerable<UserCard> GetAllCards(int userId)
        {
            return _context.UserCards
                .Where(uc => uc.UserId == userId)
                .ToList();
        }

        public UserCard AddCard(UserCard userCard)
        {
            _context.UserCards.Add(userCard);
            _context.SaveChanges();
            return userCard;
        }

        public void SetDefaultCard(int userId, int cardId)
        {
            var userCards = _context.UserCards
                .Where(uc => uc.UserId == userId)
                .ToList();

            foreach (var card in userCards)
            {
                card.SetAsDefault = (card.Id == cardId) ? 1 : 0;
            }
            _context.SaveChanges();
        }
        public UserCard GetDefaultCard(int userId)
        {
            var userCards = _context.UserCards
                .Where(uc => uc.UserId == userId)
                .ToList();

            var count = 0;
            UserCard? defaultCard = null;

            foreach (var card in userCards)
            {
                if(count == 0)
                {
                    defaultCard = card;
                }
                if(card.SetAsDefault != 0)
                {
                    return (card);
                }
                count++;
            }
            return defaultCard;
            
        }
    }
}
