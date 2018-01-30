using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using PripremaTest1.Models;
namespace PripremaTest1.Interfaces
{
    public interface IAuthorRepo
    {
        IEnumerable<Author> GetAll();
        Author GetById(int id);
        void Add(Author author);
        void Edit(Author author);
        void Delete(Author author);
        bool AuthorExists(int id);
    }
}
