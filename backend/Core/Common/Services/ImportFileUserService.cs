using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;
using CsvHelper;
using CsvHelper.Configuration;


namespace Common.Services
{
    public class ImportFileUserService
    {
        public static List<T> ImportFile<T>(string filePath)
        {
            var configReadCsv = new CsvConfiguration(CultureInfo.InvariantCulture)
            {
                HasHeaderRecord = true,
                Delimiter = ";",
                MissingFieldFound = null
            };

            using (var reader = new StreamReader(filePath))

            using (var csv = new CsvReader(reader, configReadCsv))
            {
                var records = csv.GetRecords<T>().ToList();
                return records;
            }
        }
    }
}