using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using PripremaTest1.Models;
namespace PripremaTest1.Interfaces
{
    public interface IBookRepo
    {
        IEnumerable<Book> GetAll();
        Book GetById(int id);
        void Add(Book book);
        void Edit(Book book);
        void Delete(Book book);
        IEnumerable<Book> GetByAuthor(int authorId);
        bool BookExists(int id);
    }
}
